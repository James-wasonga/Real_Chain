const RealEstate = artifacts.require("RealEstate");

contract('RealEstate', (accounts) => {
  let a;

  beforeEach(async () => {
    a = await RealEstate.new()
  });
  
  
  it("should be able to buy a registered property", async () => {
    await a.addProperty("Kisumu", "1000000000000000000", "image4", "Property 1");
    const val = 10 ** 18
    const b = await a.buyProperty(1, {from: accounts[0], value: val.toString()});
    // console.log(b);

    let c = await a.properties(1);
    console.log(c);
    assert.equal(c.isForSale, false);
    
  })

  it("should be able to display a registered property", async() => {
    await a.addProperty("Kisumu", "1", "image4", "A3");
    let c = await a.properties(1);
    assert.equal(c.location, "Kisumu");

  })
  it("should be able to display the properties of changeOwnership", async() => {
    await a.addProperty("Kisumu", "1000000000000000000", "image4", "A3", {from: accounts[0]});
    const val = 10 ** 18
    let c = await a.properties(1);
    console.log(c)

    await a.buyProperty(1, {from: accounts[1], value: val.toString()})
     c = await a.properties(1);
    console.log(c)


    assert.equal(c.isForSale, false);
    await a.changeOwnership(1, {from: accounts[1]})
    c = await a.properties(1);
    assert.equal(c.isForSale, true);
    console.log(c)
  })

  
});
