import { toTreeData } from '../index';

describe('util tests', function () {
  describe('feature tests', function () {
    it('convert with toTreeData', function (done) {
      const originData = [
        {
          "id": 1,
          "code": "0001",
          "name": "一级部门",
          "pId": 1,
          "describe": "测试部门",
          "addr": "测试地址",
          "enable": 1,
          "lev": 1
        },
        {
          "id": 2,
          "code": "0002",
          "name": "二级部门",
          "pId": 1,
          "describe": "",
          "addr": "",
          "enable": 1,
          "lev": 2
        },
        {
          "id": 3,
          "code": "0003",
          "name": "一级部门2",
          "pId": 3,
          "describe": "",
          "addr": "",
          "enable": 1,
          "lev": 1
        }
      ];
      const treeData = toTreeData(originData);
      expect(treeData.length).to.be.equal(2);
      expect(treeData[0].items.length).to.be.equal(1);
      expect(treeData[0]).to.have.all.keys('id', 'name', 'data', 'items');
      expect(treeData[0].items[0]).to.have.all.keys('id', 'name', 'data');
      done();
    });
  });
});
