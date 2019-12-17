const RECORD_NOT_FOUND = "Record matching query not found"
const SETUP_ERROR = 'Connection to database has not been set yet!'
const UNEQUAL_BOUNDED_PARAMETER = 'Number of bounded parameters is not equal to variables'
const DB_VARIABLE_ERROR = 'Values of can only be number, string or boolean'
const RECORD_NOT_STORED = 'This record is not stored yet'

// Error Messages
function DRIVER_NOT_SUPPORTED(driver) { return `'${driver}' is not a supported database. Supported databases includes mysql, postgres and sqlite` }

function SETUP_OPTION_MISSING(option) { return `The '${option}' option is required for this database!`; }

function VARIABLE_NOT_PRESENT(variable) { return `Variable '${variable}' is not present in parameters`; }


module.exports = { RECORD_NOT_FOUND, SETUP_ERROR, UNEQUAL_BOUNDED_PARAMETER, DB_VARIABLE_ERROR, RECORD_NOT_STORED, DRIVER_NOT_SUPPORTED, SETUP_OPTION_MISSING, VARIABLE_NOT_PRESENT }