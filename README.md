# NodeJS Framework
a simple NodeJS Framework

I try to write all Comments in English, I´m sorry if it is not perfect.
The HTML Language is actually German, because most of my Customers are from Germany.
In a later Version, I will build a Metalanguages System with i18n. 

Includes:
    - WebServer ( Express )
    - TemplateSystem ( Twig )
    - Database ( TypeORM ) ( Current optimized for MySQL )
    - Plugin System
    - Folder "frontend" is only for frontend files! In subFolder "compiled", the core save the files from "views".
    
Folder-Structure of Plugins:
    - [folder]
        -> helper.js
        -> views    >> Files of Frontend
            -> css      >> Stylesheets 
            -> img      >> Images 
            -> js       >> Scripts
            -> other    >> Other Files 
            -> twig     >> Template Files
    
