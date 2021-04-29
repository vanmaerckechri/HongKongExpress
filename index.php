<?php
include_once("core/Search.php");
include_once("core/FilesManager.php");
include_once("core/StringManager.php");

// load cartes to mount navigation
$content_nav = FilesManager::loadAllJsonFiles('content/cartes');

$url = !empty($_GET['url']) ? $_GET['url'] : "accueil";
$url = StringManager::convertToCleanPath($url);
$url = explode(DIRECTORY_SEPARATOR, $url);

$view = 'views/' . $url[0] . '.php';

if (file_exists($view) && (
    ($url[0] != "carte") && count($url) < 3 ||
    ($url[0] == "carte" && array_key_exists($url[1], $content_nav) && count($url) < 4)))
{
    switch ($url[0]):
        case 'accueil':
            $content_horaires = FilesManager::loadJsonFile(StringManager::convertToCleanPath('content/infos/') . 'horaires.json');
            $content_adresse = FilesManager::loadJsonFile(StringManager::convertToCleanPath('content/infos/') . 'adresse.json');
            break;
        case 'cartes':
            $content_cartes = $content_nav;
            break;
        case 'carte':
            $content_carte = $content_nav[$url[1]];
            break;
        case 'menus':
            $content_menus = FilesManager::loadAllJsonFiles('content/menus');
            break;
        case 'recherche':
            $keyWord = isset($_POST["search"]) && !empty($_POST["search"]) ? StringManager::cutStringPosWithoutCutWord(trim(htmlspecialchars($_POST["search"], ENT_NOQUOTES)), ' ', 75) : '';
            $stopWord = ['ou', 'et', 'à', 'un', 'une', 'des', 'le', 'la', 'les', 'au', 'aux', 'et', 'de', 'du'];
            $maxCost = 2;
            Search::launch('horaires', FilesManager::loadJsonFile(StringManager::convertToCleanPath('content/infos/') . 'horaires.json'), $keyWord, $stopWord, $maxCost);
            Search::launch('adresse', FilesManager::loadJsonFile(StringManager::convertToCleanPath('content/infos/') . 'adresse.json'), $keyWord, $stopWord, $maxCost);
            Search::launch('cartes', $content_nav, $keyWord, $stopWord, $maxCost);
            Search::launch('menus', FilesManager::loadAllJsonFiles('content/menus'), $keyWord, $stopWord, $maxCost);
            $search_content = Search::get_result();
            break;
    endswitch;

    include $view;
}
else
{
    header('HTTP/1.1 404 Not Found');
    include('views/404.php');
}
include_once("views/template.php");
?>