run-api:
	bash -c '. ~/.nvm/nvm.sh && nvm use 15 && cd ./api && npm start'

run-frontend:
	cd ./frontend && npm start
