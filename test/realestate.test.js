const RealEstate = artifacts.require("RealEstate");

contract('RealEstate', (accounts) => {
  let a;

  beforeEach(async () => {
    a = await RealEstate.new()
  });
  
  
  it("should be able to buy a registered property", async () => {
    await a.addProperty("Kisumu", "1000000000000000000", "image4");
    const val = 10 ** 18
    const b = await a.buyProperty(1, {sender: accounts[0], value: val.toString()});
    console.log(b);

    let c = await a.properties(1);
    console.log(c);
    assert.equal(c.isForSale, false);
    
  })

  it("should be able to display a registered property", async() => {
    await a.addProperty("Kisumu", "1", "image4");
    let c = await a.properties(1);
    assert.equal(c.location, "Kisumu");

  })
  // it("should be able to display the properties of changeOwnership", async() => {
  //   await a.addProperty("Kisumu", "1", "image4");
  //   let c = await a.properties(1);
  //   assert.equal(c.location, "Kisumu");

  // })

  
});
