# NodeJS Framework
a simple NodeJS Framework<br>

I try to write all Comments in English, I´m sorry if it is not perfect.<br>
The HTML Language is actually German, because most of my Customers are from Germany.<br>
In a later Version, I will build a Metalanguages System with i18n. <br>

ATTENTION: Don´t change something in folder "backend/tgsoft" or "frontend/tgsoft". A further Update can discard these Changes. If you want to write a Module, create a own folder.

<br>
Includes:<br>
    - WebServer ( Express )<br>
    - TemplateSystem ( Twig )<br>
    - Database ( TypeORM ) ( Current optimized for MySQL )<br>
    - Module System<br>
    - Override the Frontend "Core" files with "tgsoft_override"<br>
    - Folder "frontend" is only for frontend files!<br>
    - The complete Core only needs 2 Main Folders ( backend/tgsoft | frontend/tgsoft). Do not change anything in these folders, or updates can destroy your Program.<br> 
    <br>
Folder-Structure of Plugins:<br>
    - [folder - Backend]<br>
        -> [classes] // Classes of the Module<br>
        -> [database] // Database entities and functions of Module<br>
        -> [functions] // Other functions of Module<br>
    - [folder - frontend]<br>
        -> free as use<br>
            
    
