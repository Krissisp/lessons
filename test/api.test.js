const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const should = chai.should();

describe('GET', () => {
  it('Выборка по двум датам', (done) => {
    chai.request(server)
      .get('/?date=2019-09-01,2019-09-04&teacherIds=1,4&studentsCount=1,4')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        done();
      });
  }).timeout(10000);

  it('Тест на дефолтные значения', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  }).timeout(10000);

  it('Пагинация', (done) => {
    chai.request(server)
      .get('/?date=2019-09-01,2019-09-04&teacherIds=1,4&studentsCount=1,4&lessonsPerPage=1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  }).timeout(10000);

  it('Проверка валидации 1', (done) => {
    chai.request(server)
      .get('/?date=2019-09-0&teacherIds=1,4&studentsCount=1,4')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        done();
      });
  }).timeout(10000);

  it('Проверка валидации 2', (done) => {
    chai.request(server)
      .get('/?teacherIds=gj&studentsCount=1,4')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        done();
      });
  }).timeout(10000);
});

describe('POST', () => {
  it('Ограничение по дате', (done) => {
    const lessons = {
      firstDate: '2022-05-28',
      title: 'test3',
      lessonCount: 300,
      teacherIds: [1, 2],
      days: [1],
    };
    chai.request(server)
      .post('/lessons')
      .send(lessons)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(53);
        done();
      });
  }).timeout(10000);

  it('Ограничение по количеству', (done) => {
    const lessons = {
      firstDate: '2022-05-28',
      title: 'test2',
      lastDate: '2023-05-28',
      teacherIds: [1, 2],
      days: [0, 1, 2, 3, 4, 5, 6],
    };
    chai.request(server)
      .post('/lessons')
      .send(lessons)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(300);
        done();
      });
  }).timeout(10000);

  it('Валидация: взаимоисключение параметров', (done) => {
    const lessons = {
      firstDate: '2022-05-28',
      title: 'test2',
      lessonCount: 2,
      lastDate: '2023-05-28',
      teacherIds: [1, 2],
      days: [0, 1, 2, 3, 4, 5, 6],
    };
    chai.request(server)
      .post('/lessons')
      .send(lessons)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  }).timeout(10000);

  it('Валидация: отсутствие параметра', (done) => {
    const lessons = {
      title: 'test2',
      lessonCount: 2,
      lastDate: '2023-05-2o',
      teacherIds: [1, 2],
      days: [0, 1, 2, 3, 4, 5, 6],
    };
    chai.request(server)
      .post('/lessons')
      .send(lessons)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        done();
      });
  }).timeout(10000);

  it('Проверка количества', (done) => {
    const lessons = {
      firstDate: '2022-05-28',
      title: 'test2',
      lessonCount: 13,
      teacherIds: [1, 2],
      days: [0, 5, 6],
    };
    chai.request(server)
      .post('/lessons')
      .send(lessons)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(13);
        done();
      });
  }).timeout(10000);
});
