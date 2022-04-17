module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a21f612562c3fda12f52f6647f67eb88'),
  },
});
