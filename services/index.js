
const {
  getCorpora,
  getCorpus,
  createCorpus,
  updateCorpus,
  updateCorpusPart,
  deleteCorpus,
  packCorpus,
} = require( './corporaTransactions' );

const routes = {
  'get-corpora': getCorpora,
  'get-corpus': getCorpus,
  'create-corpus': createCorpus,
  'delete-corpus': deleteCorpus,
  'update-corpus': updateCorpus,
  'pack-corpus': packCorpus,
  'update-corpus-part': updateCorpusPart,
};

module.exports = routes;
