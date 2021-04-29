<?php
$content_title = 'Les Cartes | Honk Kong Express';
$meta_description = "Toutes les catégories de cartes où figurent de délicieux plats chinois.";

$content = '';
foreach ($content_cartes as $content_carte)
{
    include("carte.php");
    $content .= $content_main;
}
$content_main = $content;
ob_start();?>
    <div class="cartes-container">
        <?php if ($url[0] != 'recherche'):?>
            <div class="maxWidth-container">
                <h1 class="mainTitle">Choisissez vos plats préférés parmis nos nombreuses cartes</h1>
            </div>
        <?php endif?>
        <?=$content?>
    </div>
<?php $content_main = ob_get_clean();?>