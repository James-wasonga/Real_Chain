const formatter = new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"})
console.log(abi);
var web3 = new Web3(window.ethereum);
// const address="0x6ECdb66a0AaB4433A12C00c54403a84df594C8d3";
// 
const newAddress = "0x2437438489e2E5A55e6A04e4CA2F5001D5DF28Ce"
var contract = new web3.eth.Contract(abi, newAddress);
function upload(){
    var propertyImage = document.getElementById("propertyImage");
    const formData = new FormData();
    formData.append('file', propertyImage.files[0]);
    console.log("formdata " + JSON.stringify(formData));
    const options = {
        method: "POST",
        body: {file: propertyImage}, 
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    fetch('./upload', options).then(response => response.text()).then((data) => console.log(data));
}
async function connect(){
    // await window.web3.currentProvider.enable();
    // window.web3 = new Web3(window.web3.currentProvider);
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];
    
    
}

async function addProperty(){
    var propertyName = document.getElementById("propertyName").value;
    var propertyPrice = document.getElementById("propertyPrice").value;
    var propertyImage = document.getElementById("propertyImage").value;

    if(propertyName == "" || propertyPrice == "" || propertyImage == ""){
        alert("please fill in all the details");
        return;
    }

    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];
    console.log(account);
    contract.methods.addProperty(propertyName, web3.utils.toWei(propertyPrice, "ether"), propertyImage).send({from: account, gasLimit: "1000000"}).then((data) => {
        alert("property added successfuly");
        console.log(data);
    }).catch((e) => {
        console.log(e);
    })
}

function viewProperties(){
    var properties = [];
    contract.methods.propertyCounter().call().then((data) => {
        for (let i = 1; i <= data; i++){
            contract.methods.properties(i).call().then(({image, isForSale, location, price, owner}) => {
                const ethPrice = web3.utils.fromWei(price.toString(), "ether");
                properties.push({i, image, isForSale, location, ethPrice, owner});
                document.getElementById("myProperties").innerHTML += `
        
        <div class="w3-col l4">
                <div class="w3-card"><div class="background w3-padding" style="background-image: url('.${image}');">
                    <button class="w3-btn ${isForSale == true ? 'w3-blue':'w3-red'} w3-round" onclick="buyProperty(${i}, ${price})">${isForSale == true ? 'buy':'bought'}</button>

                </div>
                <div class="w3-padding">
                    <h3>${location}</h3>
                    <h4><b>${ethPrice}</b></h4>
                    <div style="display: flex;">
                        <div style="flex: 1">
                            &nbsp;
                        </div>
                        <div style="flex: 1; align-items: right; align-content: right;">
                            <button class="w3-btn w3-border w3-text-blue w3-round w3-border-blue" onclick="openPage(${i})">See more</button>
                        </div>
                        
                    </div>
                </div>
            </div>

            
            </div>
        `
            })
        }
    })
    window.properties = properties;
}

viewProperties();

function openPage(i){
    window.location.href = "./details.html?" + i
}

async function displayPageData(){
 const propertyId = window.location.search.substr(1);
 await contract.methods.properties(propertyId).call().then(function({image, isForSale, location, price, owner}){
    // console.log(data);
    propertyPrice = web3.utils.fromWei(price, "ether");
    document.getElementById('details').innerHTML += `
    <div class="w3-col l6" style="background-image: url('${image}'); background-size: cover; background-position: center;background-repeat: no-repeat; height: 300px;"></div>
            <div class="w3-col l6">
                <table class="w3-table">
                    <tr>
                        <td><b>Location</b></td>
                        <td><small>${location}</small></td>
                    </tr>
                    <tr>
                        <td><b>Price</b></td>
                        <td><small>${propertyPrice}</small></td>
                    </tr>
                    <tr>
                        <td><b>owner</b></td>
                        <td><small>${owner}</small></td>
                    </tr>
                </table>
                <br>
                <br>
                <br>
                <button class="w3-button w3-border-blue w3-text-blue w3-border" onclick="buyProperty(${propertyId}, ${price})">Buy</button>
            </div>
    `
 })
}


async function buyProperty(id, propertyPrice){
    console.log(propertyPrice)
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];

    await contract.methods.buyProperty(id).send({from: account, gasLimit: "1000000", value: propertyPrice.toString()}).then((data) => {
        console.log(data);
        alert("property bought succesfully");
    }).catch((e)=>{
        e.code == -32603 ? alert("property has already been bought"): alert("some error occured");
    })
}

displayPageData();


async function checkConnection(){

}