import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { setFutureBlockTimestamp } from '../utils/set_future_block_timestamp';

describe('Set Future Block Timestamp Utility', () => {
  let currentTimestamp: number;

  beforeEach(async () => {
    // Get current block timestamp
    currentTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
  });

  describe('Setting Future Timestamps', () => {
    it('should set timestamp to a future value', async () => {
      const futureTime = currentTimestamp + 3600; // 1 hour in the future
      
      await setFutureBlockTimestamp(futureTime);
      
      const newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(futureTime);
    });

    it('should set timestamp using time delta', async () => {
      const timeIncrease = 3600; // 1 hour
      
      await setFutureBlockTimestamp(currentTimestamp + timeIncrease);
      
      const newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + timeIncrease);
    });

    it('should handle large time increases', async () => {
      const oneYear = 365 * 24 * 60 * 60; // 1 year in seconds
      
      await setFutureBlockTimestamp(currentTimestamp + oneYear);
      
      const newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + oneYear);
    });

    it('should set multiple increasing timestamps', async () => {
      const oneHour = 3600;
      const twoHours = 7200;
      const threeHours = 10800;
      
      // Set timestamp to one hour in the future
      await setFutureBlockTimestamp(currentTimestamp + oneHour);
      let newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + oneHour);
      
      // Set timestamp to two hours in the future
      await setFutureBlockTimestamp(currentTimestamp + twoHours);
      newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + twoHours);
      
      // Set timestamp to three hours in the future
      await setFutureBlockTimestamp(currentTimestamp + threeHours);
      newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + threeHours);
    });

    it('should revert when setting timestamp in the past', async () => {
      const pastTime = currentTimestamp - 3600; // 1 hour in the past
      
      await expect(
        setFutureBlockTimestamp(pastTime)
      ).to.be.revertedWith('Cannot set timestamp in the past');
    });

    it('should work with different time units', async () => {
      // Test with minutes
      await setFutureBlockTimestamp(currentTimestamp + 60); // 1 minute
      let newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + 60);

      // Test with hours
      await setFutureBlockTimestamp(currentTimestamp + 3600); // 1 hour
      newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + 3600);

      // Test with days
      await setFutureBlockTimestamp(currentTimestamp + 86400); // 1 day
      newTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
      expect(newTimestamp).to.equal(currentTimestamp + 86400);
    });

    it('should maintain consistent mining after timestamp change', async () => {
      const futureTime = currentTimestamp + 3600;
      
      await setFutureBlockTimestamp(futureTime);
      
      // Mine a few blocks and check timestamps are increasing normally
      await ethers.provider.send('evm_mine', []);
      const timestamp1 = (await ethers.provider.getBlock('latest')).timestamp;
      
      await ethers.provider.send('evm_mine', []);
      const timestamp2 = (await ethers.provider.getBlock('latest')).timestamp;
      
      expect(timestamp2).to.be.greaterThan(timestamp1);
    });
  });
}); 