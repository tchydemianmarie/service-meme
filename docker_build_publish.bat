IF [%1] == [] GOTO error


docker login
RMDIR /s /q .\dist\

call docker_build.bat

rem RUN DOCKER TO PUBLISH
docker tag server-remote-control:latest registry.aptero.co/server-remote-control:latest
docker push registry.aptero.co/server-remote-control:latest

docker tag server-remote-control:latest registry.aptero.co/server-remote-control:%1
docker push registry.aptero.co/server-remote-control:%1


GOTO :EOF
:error
ECHO incorrect_parameters