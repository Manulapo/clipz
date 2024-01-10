import { FbTimestampsPipe } from './fb-timestamps.pipe';

describe('FbTimestampsPipe', () => {
  it('create an instance', () => {
    const pipe = new FbTimestampsPipe();
    expect(pipe).toBeTruthy();
  });
});
