<?php
$content_title = 'Ressource non Trouvée | Honk Kong Express';
$meta_description = !isset($meta_description) ? '' : $meta_description;

ob_start();?>
    <div class="section">
        <h1>Page Introuvable!</h1>
    </div>
<?php $content_main = ob_get_clean();?>