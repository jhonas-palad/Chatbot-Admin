echo "Switching to branch main"
git checkout main

echo "Build started..."
npm run build

echo "Deploying files to the server..."
scp -r build/* jhonas@139.162.82.172:/var/www/139.162.82.172/

echo "Build successfully transfered"