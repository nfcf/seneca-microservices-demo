describe('App End 2 End Tests', function () {
    /*beforeEach(function () {
        browser.get('https://localhost:3333'); 
    });*/

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Running Log');
    });

    it('should change languages', function () {
        var titleElement = element(by.css('.md-title'));

        element(by.id('pt')).click(); 
        browser.wait(function () {
                return titleElement.getText().then(function (text) {
                    return text === 'Corridas';
                });
        }, 3000);
        titleElement.getText().then(function (text) {
            expect(text).toEqual('Corridas');
        });
        
        element(by.id('en')).click();
        browser.wait(function () {
                return titleElement.getText().then(function (text) {
                    return text === 'Runs';
                });
        }, 3000);
        titleElement.getText().then(function (text) {
            expect(text).toEqual('Runs');
        });
    });
});