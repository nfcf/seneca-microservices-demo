exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    specs: ['app/app.e2e.spec.js'],

    onPrepare: function () {
        browser.driver.get('https://localhost:3333' + '/login');

        browser.driver.findElement(by.id('email')).sendKeys('admin@gmail.com');
        browser.driver.findElement(by.id('password')).sendKeys('admin');
        browser.driver.findElement(by.id('login')).click();

        // Login takes some time, so wait until it's done.
        // For the login, we know it's done when it redirects to /runs
        return browser.wait(function () {
            return browser.getCurrentUrl().then(function (url) {
                return /runs/.test(url);
            });
        }, 10000);
    }
}