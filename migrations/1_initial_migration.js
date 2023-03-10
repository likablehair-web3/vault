require('dotenv').config();
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Vault = artifacts.require("Vault")
const Token = artifacts.require("Token")

//const ADMIN_ROLE = 'a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775';  //keccak256("ADMIN_ROLE")
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
module.exports = async (deployer, network, accounts) => {

    deployer = accounts[0];
    if (network == "development") {
        testOwner = accounts[0];

        const tokenInstance = await deployProxy(Token, ["myStableCoin", "MSC", 1000000], { from: testOwner });
        console.log('TokenInstance Deployed: @ ', tokenInstance.address);

        const vaultInstance = await deployProxy(Vault, [tokenInstance.address], { from: testOwner });
        console.log('VaultInstance Deployed: @ ', vaultInstance.address);
    } else if (network == "dashboard") {
        let IS_UPGRADE = false;
        let VAULT_ADDRESS = "0x";


        const accounts = await web3.eth.getAccounts();
        const testOwner = accounts[0];

        if (IS_UPGRADE == 'true') {
            console.log('contracts are being upgraded');

            const VaultInstance = await upgradeProxy(VAULT_ADDRESS, Vault, [], { from: testOwner });
            console.log('New Vault instance Deployed: @ : ', VaultInstance.address);

        } else {
            try {
                console.log('contracts are being deployed')

                const tokenInstance = await deployProxy(Token, ["myStableCoin", "MSC", 1000000], { from: testOwner });
                console.log('TokenInstance Deployed: @ ', tokenInstance.address);
        
                const vaultInstance = await deployProxy(Vault, [tokenInstance.address], { from: testOwner });
                console.log('VaultInstance Deployed: @ ', vaultInstance.address);

            } catch (error) {
                console.log(error)

            }
        }



    }

}