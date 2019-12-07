until mysql -h mysql_db -u chibuzo  -puntold -e 'select 1'; do 
        echo "still waiting for mysql"; sleep 1; done

exec node_modules/sequelize-cli/bin/sequelize db:migrate
exec npm start
