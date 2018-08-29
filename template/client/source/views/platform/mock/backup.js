const backups = [
  { id: 1,
    file: 'backup-129348.bak',
    size: 20481024982,
    lastchangedate: '2017-06-07 10:30:00',
    startTime: '',
    endTime: '',
    records: 22181,
    tasklog: '2017-07-24 15:06:21 fetching ZWWorkflow batch 0\n' +
  '2017-07-24 15:06:21 fetching ZDMessage batch 0\n' +
  '2017-07-24 15:06:21 select * from ZDModelTemplate\t{}\n' +
  '2017-07-24 15:06:21 select * from ZCPlatformProperty\t{}\n' +
  '2017-07-24 15:06:21 fetching ZCLink batch 0\n' +
  '2017-07-24 15:06:21 fetching ZCTagWord batch 0\n' +
  '2017-07-24 15:06:21 fetching ZDBranch batch 0\n' +
  '2017-07-24 15:06:21 select * from ZDPrivilege\t{}\n' +
  '2017-07-24 15:06:21 fetching ZCMemberLoginStat batch 0\n' +
  '2017-07-24 15:06:21 select * from ZDMetaValue\t{}\n' +
  '2017-07-24 15:06:21 fetching ZCFaceVote batch 0\n' +
  '2017-07-24 15:06:21 fetching ZCVote batch 0'},
  { id: 2, file: 'backup-111238.bak', size: 20481024982, lastchangedate: '2017-06-08 10:30:00', startTime: '2017-06-08 10:30:00', endTime: '2017-06-08 10:30:00', records: 22181, tasklog: ''},
  { id: 3, file: 'backup-458748.bak', size: 20481024982, lastchangedate: '2017-06-09 10:30:00', startTime: '2017-06-08 10:30:00', endTime: '2017-06-08 10:30:00', records: 22181, tasklog: ''},
  { id: 4, file: 'backup-34223.bak', size: 20481024982, lastchangedate: '2017-06-07 10:30:00', startTime: '2017-06-08 10:30:00', endTime: '2017-06-08 10:30:00', records: 22181, tasklog: ''},
  { id: 5, file: 'backup-1618.bak', size: 20481024982, lastchangedate: '2017-06-08 10:30:00', startTime: '2017-06-08 10:30:00', endTime: '2017-06-08 10:30:00', records: 22181, tasklog: ''},
  { id: 6, file: 'backup-748.bak', size: 20481024982, lastchangedate: '2017-06-09 10:30:00', startTime: '2017-06-08 10:30:00', endTime: '2017-06-08 10:30:00', records: 22181, tasklog: ''}
]

axiosMock.onGet('/api/backups').reply(200, {
  data: backups,
  status: 1,
  message: ''
})

const tables = [
  {id: 1, name: 'ZCADHitLog', size: '572B', records: 1, count: 1},
  {id: 2, name: 'ZCAdPosition', size: '1.675KB', records: 4, count: 1},
  {id: 3, name: 'ZCAdvertisement', size: '2.48KB', records: 1, count: 1},
  {id: 4, name: 'ZCArticleBody', size: '9.25MB', records: 4020, count: 5},
  {id: 5, name: 'ZCAttachment', size: '0', records: 0, count: 0},
  {id: 6, name: 'ZCAudio', size: '1.16KB', records: 7, count: 1},
  {id: 7, name: 'ZCADHitLog', size: '572B', records: 1, count: 1},
  {id: 8, name: 'ZCAdPosition', size: '1.675KB', records: 4, count: 1},
  {id: 9, name: 'ZCAdvertisement', size: '2.48KB', records: 1, count: 1},
  {id: 10, name: 'ZCArticleBody', size: '9.25MB', records: 4020, count: 5},
  {id: 11, name: 'ZCAttachment', size: '0', records: 0, count: 0},
  {id: 12, name: 'ZCAudio', size: '1.16KB', records: 7, count: 1}
]

axiosMock.onGet('/api/backups/tables').reply(200, {
  data: tables,
  status: 1,
  message: ''
})

const infos = {

}

axiosMock.onGet('/api/backups/infos').reply(200, {
  data: {},
  status: 1,
  message: ''
})
