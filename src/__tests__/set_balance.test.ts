import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { setBalance } from '../utils/set_balance';

describe('Set Balance Utility', () => {
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    [user1, user2] = await ethers.getSigners();
  });

  describe('Setting ETH Balance', () => {
    it('should set exact balance for an address', async () => {
      const targetBalance = ethers.utils.parseEther('100');
      
      await setBalance(user1.address, targetBalance);
      
      const actualBalance = await ethers.provider.getBalance(user1.address);
      expect(actualBalance).to.equal(targetBalance);
    });

    it('should set zero balance for an address', async () => {
      await setBalance(user1.address, 0);
      
      const actualBalance = await ethers.provider.getBalance(user1.address);
      expect(actualBalance).to.equal(0);
    });

    it('should set large balance values', async () => {
      const largeBalance = ethers.utils.parseEther('1000000'); // 1M ETH
      
      await setBalance(user1.address, largeBalance);
      
      const actualBalance = await ethers.provider.getBalance(user1.address);
      expect(actualBalance).to.equal(largeBalance);
    });

    it('should update existing balance', async () => {
      const initialBalance = ethers.utils.parseEther('100');
      const newBalance = ethers.utils.parseEther('50');
      
      // Set initial balance
      await setBalance(user1.address, initialBalance);
      
      // Update to new balance
      await setBalance(user1.address, newBalance);
      
      const actualBalance = await ethers.provider.getBalance(user1.address);
      expect(actualBalance).to.equal(newBalance);
    });

    it('should set balance for multiple addresses', async () => {
      const balance1 = ethers.utils.parseEther('100');
      const balance2 = ethers.utils.parseEther('200');
      
      await setBalance(user1.address, balance1);
      await setBalance(user2.address, balance2);
      
      const actualBalance1 = await ethers.provider.getBalance(user1.address);
      const actualBalance2 = await ethers.provider.getBalance(user2.address);
      
      expect(actualBalance1).to.equal(balance1);
      expect(actualBalance2).to.equal(balance2);
    });

    it('should handle very small balance values', async () => {
      const smallBalance = 1; // 1 wei
      
      await setBalance(user1.address, smallBalance);
      
      const actualBalance = await ethers.provider.getBalance(user1.address);
      expect(actualBalance).to.equal(smallBalance);
    });

    it('should revert when setting negative balance', async () => {
      await expect(
        setBalance(user1.address, -1)
      ).to.be.reverted;
    });

    it('should work with different input number formats', async () => {
      // Test with BigNumber
      await setBalance(user1.address, ethers.BigNumber.from('100000000000000000')); // 0.1 ETH
      let balance = await ethers.provider.getBalance(user1.address);
      expect(balance).to.equal(ethers.BigNumber.from('100000000000000000'));

      // Test with string
      await setBalance(user1.address, '200000000000000000'); // 0.2 ETH
      balance = await ethers.provider.getBalance(user1.address);
      expect(balance).to.equal(ethers.BigNumber.from('200000000000000000'));

      // Test with number
      await setBalance(user1.address, 300000000000000000n); // 0.3 ETH
      balance = await ethers.provider.getBalance(user1.address);
      expect(balance).to.equal(ethers.BigNumber.from('300000000000000000'));
    });
  });
}); 