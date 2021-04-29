<?php
$content_title = "Informations Pratiques | Honk Kong Express";
$meta_description = "L'adresse et les horaires d'ouvertures du meilleur traiteur chinois situé à Wavre.";


ob_start();?>
	smoothScrollToDestination.add(document.getElementById("btn-goToHoraires"), document.getElementById("horaires-container"));
<?php $content_js = ob_get_clean();

ob_start();?>
	<div class="presentation-container">
		<div></div>
		<div class="presentation-intro">
			<div class="maxWidth-container">
				<h1 class="mainTitle">Hong Kong Express <span>Traiteur Chinois Situé à Wavre</span></h1>
				<p class="mainTitle-mate">Découvrez des saveurs, des goûts et des plaisirs gourmands chez le spécialiste... des plats à emporter.<span><a href="tel:+3210243609" class="phone">Téléphonez</a> et votre spécialité chinoise sera prête dans la demi-heure.</span></p>
			</div>
		</div>
		<a id="btn-goToHoraires" class="btn-arrow" href="#horaires-container"><div class="image"></div></a>
	</div>
	<?php include("part/horaires.php"); echo $content_part;?>
	<?php include("part/adresse.php"); echo $content_part;?>
<?php $content_main = ob_get_clean();?>