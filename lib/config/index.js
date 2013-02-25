var stripe = {
  development:{
    secret:'sk_fsTZdvzB32Z4n2wcfqDFW2QLRMClw',
    public:'pk_jJitGepyMBMlW5Q04EEmdaIAig5DH'
  },
  production:{
    secret:'sk_JXuwHDlmuKZxNq8rgM22AMU87Ab7T',
    public:'pk_BiKh7M3eAqA961m1P9BDqQU5QPeys'
  }
};

module.exports = {
  twitter : {
    consumer_key:'PRy32x6u6JLIbaTta6KA',
    consumer_secret:'MBtAlO1RmBawsSNBTaxyFvzqmBXvjFVnE59hvonM3zI'
  },
  stripe : stripe[process.env.NODE_ENV] 
};
