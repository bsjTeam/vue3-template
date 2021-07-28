let  MockRouter =require('./mock/index');

module.exports = {
    devServer : {
        before(app) {
            MockRouter(app)
        }
    }
}