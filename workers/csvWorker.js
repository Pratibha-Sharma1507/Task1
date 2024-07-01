const { parentPort, workerData } = require('worker_threads');
const csv = require('csvtojson');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const dbUrl = 'mongodb://localhost:27017/insurance_db';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Agent = require('../models/agent');
const User = require('../models/user');
const Account = require('../models/account');
const Category = require('../models/category');
const Carrier = require('../models/carrier');
const Policy = require('../models/policy');

csv()
  .fromFile(workerData.filePath)
  .then(async (jsonObj) => {
    try {
      for (const row of jsonObj) {
        // Insert agent
        const agent = new Agent({ name: row.agent });
        await agent.save();

        // Insert user
        const user = new User({
          firstname: row.firstname,
          dob: new Date(row.dob),
          address: row.address,
          phoneNumber: row.phone,
          state: row.state,
          zipCode: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType,
        });
        await user.save();

        // Insert account and update user
        const account = new Account({ accountName: row.account_name });
        await account.save();
        user.accounts.push(account._id);
        await user.save();

        // Insert category and carrier
        const category = new Category({ categoryName: row.category_name });
        await category.save();

        const carrier = new Carrier({ companyName: row.company_name });
        await carrier.save();

        // Insert policy and update references
        const policy = new Policy({
          policyNumber: row.policy_number,
          policyStartDate: new Date(row.policy_start_date),
          policyEndDate: new Date(row.policy_end_date),
          policyCategory: category._id,
          companyCollectionId: carrier._id,
          userId: user._id,
        });
        await policy.save();

        user.policies.push(policy._id);
        await user.save();
        
        category.policies.push(policy._id);
        await category.save();

        carrier.policies.push(policy._id);
        await carrier.save();
      }
      fs.unlinkSync(workerData.filePath); // Delete the file after processing
      parentPort.postMessage({ status: 'done' });
    } catch (error) {
      parentPort.postMessage({ status: 'error', message: error.message });
    }
  });
