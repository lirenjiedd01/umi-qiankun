export default {
  'GET /api/apps': [
    {
      name: 'app1',
      entry: 'http://localhost:8001/app1',
      base: '/app1',
      mountElementId: 'root-subapp-container',
    },
    {
      name: 'app2',
      entry: 'http://localhost:8002/app2',
      base: '/app2',
      mountElementId: 'root-subapp-container',
      props: {
        testProp: 'test',
      },
    },
    {
      name: 'app3',
      entry: 'http://localhost:8003/app3',
      base: '/app3/:abc',
      mountElementId: 'root-subapp-container',
    },
    {
      name: 'zhilan',
      entry: 'http://localhost:8004/zhilan',
      base: '/zhilan',
      mountElementId: 'root-subapp-container',
    },
    {
      name: 'backstage',
      entry: 'http://localhost:8005/backstage',
      base: '/backstage',
      mountElementId: 'root-subapp-container',
    },
  ],
};
