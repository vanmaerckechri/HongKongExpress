<?php
$content_title = 'Les Menus | Honk Kong Express';
$meta_description = "De nombreux menus contenant des plats chinois pour partager un délicieux moment en famille ou entre amis.";

ob_start();?>
    <div class="menus-container">
        <?php if ($url[0] != 'recherche'):?>
            <div class="maxWidth-container">
                <h1 class="mainTitle">Partagez un moment gourmand avec nos savoureux menus</h1>
            </div>
        <?php endif?>
        <?php foreach ($content_menus as $menu): ?>
            <div class="section">
                <div class="maxWidth-container">
                    <div class="title-container">
                        <h2 class="section-title"><?=$menu['titre']?> à <?=$menu['prix']?>€</h2>
                    </div>
                <?php if (!empty($menu['commentaires'])): ?>
                    <p class="comments"><?=$menu['commentaires']?></p>
                <?php endif;
                foreach ($menu['plats'] as $plat): ?>
                    <div class="row">
                        <p><?=$plat?></p>
                    </div>
                <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach;?>
    </div>
<?php $content_main = ob_get_clean();?>