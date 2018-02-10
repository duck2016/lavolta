const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    apps: [
        {
            name: 'logic',
            script: './index.js',
            watch: isDevelopment,
            ignore_watch: ['logs', 'test'],
            error_file: '/usr/src/app/logs/err.log',
            out_file: '/usr/src/app/logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            instances: 1
        }
    ]
};
