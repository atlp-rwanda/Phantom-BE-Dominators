import chai from 'chai';
import { getPagination } from '../src/utils/paginationHandler';

describe('UNIT TESTING', () => {
  it('MUST GET LIMIT AND OFFSET', () => {
    const paginate = getPagination(3, 5);
    chai.expect(paginate.limit).to.equal(5);
    chai.expect(paginate.offset).to.equal(15);
  });
});
