import basicSetup from "../wallet-setup/basic.setup";
import {MetaMask, metaMaskFixtures} from "@synthetixio/synpress/playwright";
import {testWithSynpress} from "@synthetixio/synpress";

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const {expect} = test;

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test('should display the airdrop form if connected to metamask otherwise not', async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.getByText('Please Connect')).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
  await page.getByTestId('rk-connect-button').click();
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
    state: 'visible',
    timeout: 30000
  })
  await page.getByTestId('rk-wallet-option-io.metamask').click();
  await metamask.connectToDapp();
});