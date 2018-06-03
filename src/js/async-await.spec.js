async function testAsync() {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      resolve('Async/Await working!');
    }, 3000);
  });
}

describe('Test ES6 features', () => {
  it('should run async/await test', async done => {
    expect(await testAsync()).toBe('Async/Await working!');
    done();
  });
});
