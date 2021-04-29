<?php ob_start();?>
    <div class="section address-container">
        <div class="maxWidth-container">
            <h2 class="section-title"><?=$content_adresse['titre']?></h2>
            <p class="address">
                <?php foreach($content_adresse['contenu'] as $adresse): ?>
                    <span class="part"><?=$adresse?></span>
                <?php endforeach; ?>
            </p>
            <div class="gg-map maxWidth-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2526.159454428737!2d4.604909016072692!3d50.71698087951304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c17d742238c921%3A0x756c634b25a21eea!2sTous+les+bonheurs!5e0!3m2!1sfr!2sbe!4v1545940317894" allowfullscreen></iframe>
            </div>
        </div>
    </div>
<?php $content_part = ob_get_clean();?>