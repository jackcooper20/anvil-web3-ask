import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { USDCSpoofToken } from '../typechain-types';

describe('USDC Spoof Token', () => {
  let usdcSpoof: USDCSpoofToken;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.utils.parseUnits('1000000', 6); // 1M USDC with 6 decimals
  const TRANSFER_AMOUNT = ethers.utils.parseUnits('1000', 6); // 1000 USDC

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the USDC spoof contract
    const USDCSpoof = await ethers.getContractFactory('USDCSpoofToken');
    usdcSpoof = await USDCSpoof.deploy();
    await usdcSpoof.deployed();
  });

  describe('Deployment', () => {
    it('should set the correct name and symbol', async () => {
      expect(await usdcSpoof.name()).to.equal('USD Coin');
      expect(await usdcSpoof.symbol()).to.equal('USDC');
    });

    it('should set the correct decimals', async () => {
      expect(await usdcSpoof.decimals()).to.equal(6);
    });

    it('should assign the total supply to the owner', async () => {
      const ownerBalance = await usdcSpoof.balanceOf(owner.address);
      expect(await usdcSpoof.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', () => {
    it('should transfer tokens between accounts', async () => {
      // Transfer from owner to user1
      await usdcSpoof.transfer(user1.address, TRANSFER_AMOUNT);
      
      const user1Balance = await usdcSpoof.balanceOf(user1.address);
      expect(user1Balance).to.equal(TRANSFER_AMOUNT);
    });

    it('should fail if sender does not have enough tokens', async () => {
      // Try to transfer more tokens than user1 has
      await expect(
        usdcSpoof.connect(user1).transfer(user2.address, TRANSFER_AMOUNT)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });

    it('should update allowances on approve', async () => {
      await usdcSpoof.approve(user1.address, TRANSFER_AMOUNT);
      expect(await usdcSpoof.allowance(owner.address, user1.address))
        .to.equal(TRANSFER_AMOUNT);
    });

    it('should transfer tokens using transferFrom', async () => {
      await usdcSpoof.approve(user1.address, TRANSFER_AMOUNT);
      await usdcSpoof.connect(user1).transferFrom(
        owner.address,
        user2.address,
        TRANSFER_AMOUNT
      );

      expect(await usdcSpoof.balanceOf(user2.address))
        .to.equal(TRANSFER_AMOUNT);
    });
  });

  describe('Minting', () => {
    it('should allow owner to mint new tokens', async () => {
      const mintAmount = ethers.utils.parseUnits('5000', 6);
      const initialSupply = await usdcSpoof.totalSupply();
      
      await usdcSpoof.mint(user1.address, mintAmount);
      
      expect(await usdcSpoof.balanceOf(user1.address))
        .to.equal(mintAmount);
      expect(await usdcSpoof.totalSupply())
        .to.equal(initialSupply.add(mintAmount));
    });

    it('should fail if non-owner tries to mint', async () => {
      const mintAmount = ethers.utils.parseUnits('5000', 6);
      
      await expect(
        usdcSpoof.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Burning', () => {
    it('should allow users to burn their tokens', async () => {
      // First transfer some tokens to user1
      await usdcSpoof.transfer(user1.address, TRANSFER_AMOUNT);
      const initialSupply = await usdcSpoof.totalSupply();
      
      // Burn half of the tokens
      const burnAmount = TRANSFER_AMOUNT.div(2);
      await usdcSpoof.connect(user1).burn(burnAmount);
      
      expect(await usdcSpoof.balanceOf(user1.address))
        .to.equal(TRANSFER_AMOUNT.sub(burnAmount));
      expect(await usdcSpoof.totalSupply())
        .to.equal(initialSupply.sub(burnAmount));
    });

    it('should fail if user tries to burn more than they have', async () => {
      await expect(
        usdcSpoof.connect(user1).burn(TRANSFER_AMOUNT)
      ).to.be.revertedWith('ERC20: burn amount exceeds balance');
    });
  });
}); 