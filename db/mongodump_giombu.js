mongodump --host oceanic.mongohq.com --port 10021 --db giombu --username giombu -password

mongorestore --db giombu --drop ./dump/giombu

