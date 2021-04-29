<?php ob_start();?>
    <div id="horaires-container" class="section horaires-container">
        <div class="maxWidth-container">
            <h2 class="section-title"><?=$content_horaires['titre']?></h2>
            <?php foreach($content_horaires['contenu'] as $horaire): ?>
                <div class="row"><span><?=$horaire['jour']?></span><span><?=$horaire['statut']?></span></div>
            <?php endforeach; ?>
        </div>
    </div>
<?php $content_part = ob_get_clean();?>
