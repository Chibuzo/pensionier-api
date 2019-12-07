until mysql -h mysql_db -u chibuzo  -puntold -e 'select 1'; do 
        echo "still waiting for mysql"; sleep 1; done

node_modules/sequelize-cli/lib/sequelize db:migrate
node index
