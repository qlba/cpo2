var cryptography = require('crypto');

module.exports.SHA256 = function(s){
	return cryptography.createHash('sha256').update(s, 'utf8').digest('hex');
};

module.exports.SHA1 = function(msg) {
	return cryptography.createHash('sha1').update(msg, 'utf8').digest('hex');
};

module.exports.MD5 = function (string) {
	return cryptography.createHash('md5').update(string, 'utf8').digest('hex');
};
