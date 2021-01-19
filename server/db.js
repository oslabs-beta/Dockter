const Influx = require('influx');

const influx = new Influx.InfluxDB({
  // TODO: Make this dynamic
  host: '172.20.0.2',
  port: 8086,
  database: 'dockter',
  schema: [
    {
      measurement: 'logs_test',
      fields: {
        message: Influx.FieldType.STRING,
      },
      tags: ['stream', 'log_level', 'container_name'],
    },
  ],
});

module.exports = influx;
