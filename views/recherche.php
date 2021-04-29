<?php
$content_title = 'Recherche | Honk Kong Express';
$meta_description = 'Moteur de recherche permettant de trouver rapidement des informations sur tout le site.';
$content_others = '<meta name="robots" content="noindex">';

$content_result = '';
foreach($search_content as $contentsByCost)
{
    foreach($contentsByCost as $cat => $content)
    {
        if(strpos($cat, 'horaires') !== false)
        {
            $content_horaires = $content;
            include("part/horaires.php");
            $content_result .= $content_part;
        }
        else if(strpos($cat, 'adresse') !== false)
        {
            $content_adresse = $content;
            include("part/adresse.php");
            $content_result .= $content_part;
        }
        else if(strpos($cat, 'cartes') !== false)
        {    
            $content_cartes = $content;
            include("cartes.php");
            $content_result .= $content_main;
        }
        else if(strpos($cat, 'menus') !== false)
        {
            $content_menus = $content;
            include("menus.php");
            $content_result .= $content_main;
        }
    }
}

ob_start();?>
    <div class="recherche-container">
        <div class="maxWidth-container">
            <h1 class="mainTitle">Recherche</h1>
            <?php if (empty($keyWord)): ?>
                <p class="mainTitle-mate">Aucun résultat trouvé!</p>
            <?php else: ?>
                <p class="mainTitle-mate">" <?=$keyWord?> "</p>
            <?php endif;?>
        </div>
        <?=$content_result?>
    </div>
<?php $content_main = ob_get_clean();?>