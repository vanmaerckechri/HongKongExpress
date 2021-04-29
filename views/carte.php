<?php
$content_title = !isset($content_title) ? 'La Carte des ' . $content_carte['titre'] . ' | Honk Kong Express' : $content_title;
$meta_description = !isset($meta_description) ? 'La liste détaillée des plats de la carte des ' . strtolower($content_carte['titre']) . ' chinois.' : $meta_description;

ob_start();?>
    <div class="section carte-container">
        <div class="maxWidth-container">
            <div class="title-container">
                <div class="titleImg-container">
                    <p><?=$content_carte['titre_chinois']?></p>
                    <div class="image" style="background-image: url('./assets/images/<?=$content_carte['image']?>');"></div>
                </div>
                <?php if ($url[0] == 'cartes' || $url[0] == 'recherche'): ?>
                    <h2 class="section-title"><?=$content_carte['titre']?></h2>
                <?php else: ?>
                    <h1 class="section-title"><?=$content_carte['titre']?></h1>
                <?php endif; ?>
            </div>
            <?php if (!empty($content_carte['commentaires'])): ?>
                <p class="comments"><?=$content_carte['commentaires']?></p>
            <?php endif; ?>
            <?php foreach ($content_carte['plats'] as $plat): ?>
            <div class="row">
                <p class="food-code"><?=$plat['code']?>.</p>
                <p class="food-name"><?=$plat['nom']?></p>
                <p class="food-price"><?=$plat['prix']?>€</p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
<?php $content_main = ob_get_clean();?>