# apollo-permissions-manager

An AngularJS frontend for managing permissions in Apollo

## Setup

Requires NodeJS / NPM to be installed

```
make run
```

## CORS Headers

```apache2
<Location "/apollo">
# https://benjaminhorn.io/code/setting-cors-cross-origin-resource-sharing-on-apache-with-correct-response-headers-allowing-everything-thro#
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
Header always set Access-Control-Max-Age "1000"                                                                                                    Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"

RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
</Location>
```

## LICENSE

AGPLv3
