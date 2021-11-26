FROM mongo:3

COPY gundam.json /gundam.json

CMD mongoimport --host db --db gundam --collection models --type json --file gundam.json --jsonArray
