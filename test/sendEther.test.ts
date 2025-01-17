import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { sendEther, sendEtherWithGas, sendEtherToMany } from '../src/sendEther';

describe('ETH Transfer Utilities', () => {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    // Set up initial balances
    await owner.sendTransaction({
      to: user1.address,
      value: ethers.utils.parseEther('10.0'),
    });
  });

  describe('sendEther', () => {
    it('should transfer ETH between addresses', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const initialBalance = await ethers.provider.getBalance(user2.address);

      await sendEther(user1.address, user2.address, amount);

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance.sub(initialBalance)).to.equal(amount);
    });

    it('should handle small amounts', async () => {
      const amount = BigNumber.from(1); // 1 wei
      const initialBalance = await ethers.provider.getBalance(user2.address);

      await sendEther(user1.address, user2.address, amount);

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance.sub(initialBalance)).to.equal(amount);
    });

    it('should fail with invalid recipient address', async () => {
      const amount = ethers.utils.parseEther('1.0');
      await expect(
        sendEther(user1.address, 'invalid-address', amount)
      ).to.be.revertedWith('Invalid recipient address');
    });

    it('should fail with insufficient balance', async () => {
      const amount = ethers.utils.parseEther('100.0'); // More than user1 has
      await expect(
        sendEther(user1.address, user2.address, amount)
      ).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('sendEtherWithGas', () => {
    it('should transfer ETH with custom gas settings', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const gasLimit = 21000;
      const gasPrice = ethers.utils.parseUnits('50', 'gwei');
      const initialBalance = await ethers.provider.getBalance(user2.address);

      await sendEtherWithGas(
        user1.address,
        user2.address,
        amount,
        gasLimit,
        gasPrice
      );

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance.sub(initialBalance)).to.equal(amount);
    });

    it('should work without optional gas parameters', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const initialBalance = await ethers.provider.getBalance(user2.address);

      await sendEtherWithGas(user1.address, user2.address, amount);

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance.sub(initialBalance)).to.equal(amount);
    });
  });

  describe('sendEtherToMany', () => {
    it('should transfer ETH to multiple recipients', async () => {
      const amount1 = ethers.utils.parseEther('1.0');
      const amount2 = ethers.utils.parseEther('2.0');
      
      const recipients = [
        { to: user2.address, amount: amount1 },
        { to: user3.address, amount: amount2 },
      ];

      const initialBalance2 = await ethers.provider.getBalance(user2.address);
      const initialBalance3 = await ethers.provider.getBalance(user3.address);

      await sendEtherToMany(user1.address, recipients);

      const finalBalance2 = await ethers.provider.getBalance(user2.address);
      const finalBalance3 = await ethers.provider.getBalance(user3.address);

      expect(finalBalance2.sub(initialBalance2)).to.equal(amount1);
      expect(finalBalance3.sub(initialBalance3)).to.equal(amount2);
    });

    it('should fail if total amount exceeds balance', async () => {
      const amount1 = ethers.utils.parseEther('50.0');
      const amount2 = ethers.utils.parseEther('51.0');
      
      const recipients = [
        { to: user2.address, amount: amount1 },
        { to: user3.address, amount: amount2 },
      ];

      await expect(
        sendEtherToMany(user1.address, recipients)
      ).to.be.revertedWith('Insufficient balance');
    });

    it('should fail if any recipient address is invalid', async () => {
      const amount = ethers.utils.parseEther('1.0');
      
      const recipients = [
        { to: user2.address, amount },
        { to: 'invalid-address', amount },
      ];

      await expect(
        sendEtherToMany(user1.address, recipients)
      ).to.be.revertedWith('Invalid recipient address');
    });

    it('should handle empty recipients array', async () => {
      await expect(
        sendEtherToMany(user1.address, [])
      ).to.not.be.reverted;
    });
  });
}); 