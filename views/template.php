<!DOCTYPE html>
<html lang="fr">
    <head prefix="og: https://ogp.me/ns#">
        <base href="http://hongkongexpress/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="description" content="<?=$meta_description ?? ''?>">
        <?=$content_others ?? ''?>
        <!--Facebook and Twitter-->
        <meta property="og:locale" content="fr_FR">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://www.cvmdev.be/productions/hongkongexpress/<?=$og_page ?? ''?>">
        <meta property="og:site_name" content="Hong Kong Express">
        <meta property="og:title" content="<?=$content_title ?? ''?>">
        <meta property="og:description" content="<?=$meta_description ?? ''?>">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image" content="https://www.cvmdev.be/productions/hongkongexpress/meta_social.png">
        <meta property="og:image:alt" content="logo du traiteur chinois Hong Kong Express">
        <!--Favison and Color-->
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
        <meta name="theme-color" content="#6d141a">
        <!--Stylesheet-->
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:500,700|Noto+Sans+TC|Oswald:400" media="all"> 
        <link rel="stylesheet" type="text/css" href="assets/css/style.css" media="all">
        <title><?=$content_title ?? ''?></title>
    </head>
    <body>
        <header>
            <div class="maxWidth-container">
                <div class="image image-logo"></div>
            </div>
            <nav>
                <div class="maxWidth-container">
                    <ul class="mainMenu-container">
                        <li><a class="nav-btn<?=$url[0] == 'accueil' ? ' selected' : ''?>" href=".">Infos</a></li>
                        <li id="subMenu-btn" class="subMenu-btn">
                            <div class="nav-btn<?=$url[0] == 'carte' || $url[0] == 'cartes' ? ' selected' : ''?>">Cartes</div>
                            <div class="subMenu-container closed">
                                <ul class="maxWidth-container">
                                    <li>
                                        <a class="nav-btn<?=$url[0] == 'cartes' ? ' selected' : ''?>" href="cartes">Toutes</a>
                                    </li>
                                    <?php foreach($content_nav as $button): ?>
                                        <li>
                                            <?php $link = StringManager::convertToCleanLink($button['titre']);?>
                                            <a class="nav-btn<?=$url[0] == 'carte' && $url[1] == $link ? ' selected' : ''?>" href="carte/<?=$link?>"><?=$button['titre']?></a>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </li>
                        <li><a class="nav-btn<?=$url[0] == 'menus' ? ' selected' : ''?>" href="menus">Menus</a></li>
                        <li class="search-container">
                            <form action="recherche" method="post">
                                <input type="text" placeholder="chercher" name="search">
                                <button class="image image-search" type="submit"></button>
                            </form>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <div id="main" class="main">
            <?=$content_main ?? ''?>
        </div>
        <footer>
            <div class="maxWidth-container footer-content">
                <p class="copyright">Copyright © 2021 - Traiteur Chinois Hong Kong Express - Wavre</p>
                <div class="maxWidth-container downMenu-container">
                    <a class="border menu" href="assets/pdf/menu2021.pdf" target="_blank" rel="noopener">télécharger le menu</a>
                    <a class="border phone" href="tel:+3210243609">010 24 36 09</a>
                    <a class="btn-facebook" href="https://www.facebook.com/hkexpresswavre" target="_blank" rel="noopener"><div class="image"></div></a>
                    <a id="btn-backToTop" class="btn-arrow" href="<?=$url[0] == 'accueil' ? '' : trim(implode('/', $url), '/')?>#"><div class="image image-arrow"></div></a>
                </div>
            </div>
        </footer>
        <script src="assets/js/Namespaces.js"></script>
        <script src="assets/js/ToggleNavPosition.js"></script>
        <script src="assets/js/OpenSubNavOnClick.js"></script>
        <script src="assets/js/ToggleDisplayBtn.js"></script>
        <script src="assets/js/SmoothScrollToDestination.js"></script>
        <?=$content_jsFiles ?? ''?>
        <script>
            (function()
            {
                "use strict";

                var toggleNavPosition = new CVM.ToggleNavPosition(document.getElementsByTagName("header")[0], document.getElementsByTagName("nav")[0], document.getElementById("main"));
                var openSubNavOnClick = new CVM.OpenSubNavOnClick(document.getElementById("subMenu-btn"));
                var toggleDisplayBtn_backToTop = new CVM.ToggleDisplayBtn(document.getElementById("btn-backToTop"));
                var smoothScrollToDestination = new CVM.SmoothScrollToDestination(document.getElementById("btn-backToTop"), document.getElementsByTagName("header")[0]);
                <?=$content_js ?? ''?>
            }());
        </script>
    </body>
</html>