/**
 * config.js
 *
 * Megagame Dashboard: Application configuration.
 */

const convict = require('convict')
const toml = require('toml')
const validator = require('validator')


function assert(assertion, err_msg) {
    if (!assertion) {
        throw new Error(err_msg)
    }
}


const convict_formats = {
    db_url: {
        name: 'url',
        coerce: (v) => v.toString(),
        validate: function(x) {
            assert(
                validator.isURL(x, {
                    protocols: [
                        'postgres',
                    ],
                    require_protocol: true,
                    require_tld: false,
                }),
                'must be a URL')
        },
    },
}


// Define the configuration schema as a Convict object.
convict.addFormats(convict_formats)
const config = convict({
    env: {
        doc: 'Deployment environment for the running application.',
        format: ['development', 'test', 'production'],
        default: 'development',
        env: 'NODE_ENV',
    },
    database: {
        url: {
            doc: 'Connection URL for the application database.',
            format: 'db_url',
            default: null,
            env: 'MEGAGAME_DASHBOARD_DB_URL',
            arg: 'database-url',
        },
    },
})

// Read the application configuration from external sources.

convict.addParser({
    extension: 'toml', parse: toml.parse,
})

const env = config.get('env')
config.loadFile('./config/' + env + '.toml')
config.validate({
    allowed: 'strict',
})

module.exports = config
