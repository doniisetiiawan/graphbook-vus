module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users',
      'email',
      {
        type: Sequelize.STRING,
        unique: true,
      }),
    queryInterface.addColumn('Users',
      'password',
      {
        type: Sequelize.STRING,
      }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Users', 'email'),
    queryInterface.removeColumn('Users', 'password'),
  ]),
};
