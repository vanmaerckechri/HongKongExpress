<?php
//TOOLS
Function removeAccents($string)
{
	$string= strtr(utf8_decode($string), utf8_decode("ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ"), "aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn");
	return strtolower($string);
}

// INIT =>
// import hierarchy from cartes and menus json
$cartes = json_decode(file_get_contents("./assets/content/cartes.json"));
$menus = json_decode(file_get_contents("./assets/content/menus.json"));
// check if the user is looking for something
$search = isset($_POST["search"]) && !empty($_POST["search"]) ? removeAccents($_POST["search"]) : false;
$searchCartesResult = [];
$searchMenusResult = new stdClass();;

// LOAD HTML CONTENT =>
// navbar
if ($search === false)
{
	ob_start();
	?>
		<ul class="mainMenu maxWidth-container">
			<li><a href="#cartes">Cartes</a></li>
			<li><a href="#menus">Menus</a></li>
			<li class="search-container">
				<form action="./index.php#search" method="post">
					<input type="text" placeholder="chercher" name="search">
					<button type="submit"><img src="./assets/img/search.png" alt="bouton de recherche"></button>
				</form>
			</li>
		</ul>
	<?php
	$nav = ob_get_clean();
}
else
{
	ob_start();
	?>
		<ul class="mainMenu maxWidth-container">
			<li><a href="index.php">Accueil</a></li>
			<li><a href="?#cartes">Cartes</a></li>
			<li><a href="?#menus">Menus</a></li>
			<li class="search-container">
				<form action="./index.php#search" method="post">
					<input type="text" placeholder="chercher" name="search">
					<button type="submit"><img src="./assets/img/search.png" alt="bouton de recherche"></button>
				</form>
			</li>
		</ul>
	<?php
	$nav = ob_get_clean();
}

// business hours
ob_start();
?>
	<div class="horaires-container">
		<h3 class="underline">Heures d'Ouverture</h3>
		<div class="row"><span>lundi</span><span>fermé</span></div>
		<div class="row"><span>mardi</span><span>17h30 - 22h00</span></div>
		<div class="row"><span>mercredi</span><span>11h30 - 14h30 & 17h30 - 22h00</span></div>
		<div class="row"><span>jeudi</span><span>11h30 - 14h30 & 17h30 - 22h00</span></div>
		<div class="row"><span>vendredi</span><span>11h30 - 14h30 & 17h30 - 22h00</span></div>
		<div class="row"><span>samedi</span><span>11h30 - 14h30 & 17h30 - 22h00</span></div>
		<div class="row"><span>dimanche</span><span>11h30 - 14h30 & 17h30 - 22h00</span></div>
	</div>
<?php
$businessHours = ob_get_clean();

// address
ob_start();
?>
	<div class="address-container">
		<h3 class="underline">Adresse</h3>
		<p class="address">Tous les Bonheurs s.p.r.l.<span>35, Rue du Chemin de Fer</span><span>1300 - Wavre</span></p>
		<iframe class="gg-map maxWidth-container" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2526.159454428737!2d4.604909016072692!3d50.71698087951304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c17d742238c921%3A0x756c634b25a21eea!2sTous+les+bonheurs!5e0!3m2!1sfr!2sbe!4v1545940317894" allowfullscreen></iframe>
	</div>
<?php
$address = ob_get_clean();

if ($search === false)
{
// cartes
	ob_start();
	?>
		<h2>Les Cartes</h2>
		<?php
		foreach ($cartes as $carteId => $carte) 
		{
			$title = $carte->{'titre'};
		?>
			<div class="cartes-container">
				<div class="title-container">
					<div class="titleImg-container">
						<p><?=$carte->{'titre_chinois'}?></p>
						<img src="./assets/img/<?=$carte->{'fichier'}?>.png" alt="logo de la carte">
					</div>
					<h3><?=$carte->{'titre'}?></h3>
				</div>
			<?php
			if (!empty($carte->{'commentaires'}))
			{
			?>
				<p class="food-comments"><?=$carte->{'commentaires'}?></p>
			<?php
			}
			$plats = json_decode(file_get_contents("./assets/content/" . $carte->{'fichier'} . ".json"));		
			foreach ($plats as $platId => $plat)
			{
				?>
				<div class="row">
					<p class="food-code"><?=$plat->{'code'}?>.</p>
					<p class="food-name"><?=$plat->{'nom'}?></p>
					<p class="food-price"><?=number_format($plat->{'prix'}, 2, '.', '')?>€</p>
				</div>
			<?php
			}
			?>
			</div>
			<?php
		}
	$cartesHtml = ob_get_clean();
// menus
	ob_start();
	?>
		<h2>Les Menus</h2>
		<?php
		foreach ($menus as $menuId => $menu) 
		{
			$title = $menu->{'titre'};
		?>
			<div class="menus-container">
				<h3><?=$menu->{'titre'}?></h3>
			<?php
			if (!empty($menu->{'commentaires'}))
			{
			?>
				<p class="food-comments"><?=$menu->{'commentaires'}?></p>
			<?php
			}
			$plats = json_decode(file_get_contents("./assets/content/" . $menu->{'fichier'} . ".json"));		
			foreach ($plats as $platId => $plat)
			{
			?>
				<div class="row">
					<p><?=$plat?></p>
				</div>
			<?php
			}
			?>
			</div>
			<?php
		}
	$menusHtml = ob_get_clean();
}
else
{
// search
	ob_start();
		// search in cartes
		foreach ($cartes as $carteId => $carte) 
		{
			$title = $carte->{'titre'};
			$plats = json_decode(file_get_contents("./assets/content/" . $carte->{'fichier'} . ".json"));		
			foreach ($plats as $platId => $plat)
			{
				if (substr_count(removeAccents($title), $search) || substr_count(removeAccents($plat->{'nom'}), $search))
				{
					$searchCartesResult[$title] = !isset($searchCartesResult[$title]) || empty($searchCartesResult[$title]) ? [] : $searchCartesResult[$title];
					array_push($searchCartesResult[$title], $plat);
				}
			}
		}
		// search in menus
		foreach ($menus as $menuId => $menu) 
		{
			$title = $menu->{'titre'};
			$plats = json_decode(file_get_contents("./assets/content/" . $menu->{'fichier'} . ".json"));
			foreach ($plats as $platId => $plat)
			{	
				if (substr_count(removeAccents($title), $search) || substr_count(removeAccents($menu->{'commentaires'}), $search) || substr_count(removeAccents($plat), $search))
				{
					$menu->{"plats"} = $plats;
					$searchMenusResult->{$title} = $menu;
					break;
				}
			}
		}
		// build html with content of search result
		?>
		<h2>Recherche: "<?=htmlspecialchars($search, ENT_QUOTES);?>"</h2>
		<?php
		// build business hours
		if (substr_count(removeAccents($businessHours), $search) || substr_count($search, "horaire"))
		{
			echo $businessHours;
		}
		// build address
		if (substr_count(removeAccents($address), $search) || substr_count($search, "itineraire") || substr_count($search, "route") || substr_count($search, "acces"))
		{
			echo $address;
		}
		// build cartes
		foreach ($searchCartesResult as $carteId => $carte)
		{
		?>
			<div class="cartes-container">
			<h3><?=$carteId?></h3>
			<?php
			foreach ($carte as $platId => $plat)
			{
			?>
				<div class="row">
					<p class="food-code"><?=$plat->{'code'}?>.</p>
					<p class="food-name"><?=$plat->{'nom'}?></p>
					<p class="food-price"><?=number_format($plat->{'prix'}, 2, '.', '')?>€</p>
				</div>
			<?php
			}
			?>
			</div>
			<?php
		}
		// build menus
		foreach ($searchMenusResult as $menuId => $menu)
		{
		?>
			<div class="menus-container">
			<h3><?=$menu->{"titre"}?></h3>
			<p class="food-comments"><?=$menu->{"commentaires"}?></p>
			<?php
			foreach ($menu->{"plats"} as $platId => $plat)
			{
			?>
				<div class="row">
					<p><?=$plat?>.</p>
				</div>
				<?php
			}
			?>
			</div>
			<?php
		}
	$searchHtml = ob_get_clean();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="Traiteur Chinois situé à proximité de la gare de Wavre. Commandez vos savoureux mets sur place ou par téléphone, ceux-ci seront prêts dans la demi-heure.">
    <link rel="icon" type="image/png" href="">
	<link href="https://fonts.googleapis.com/css?family=Poppins:500,700|Noto+Sans+TC|Oswald:400" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
    <title>HONG KONG EXPRESS 香港快餐</title>
</head>
<body>
	<header>
		<div class="maxWidth-container">
			<div class="header-title">
				<img src="./assets/img/logo.png" alt="le logo de l'établissement représenté par un cuisinier une poêle à la main">
				<h1>HONG KONG EXPRESS <span class="chinese-fontFam">香港快餐</span><span class="header-title_subtitle">Traiteur Chinois à Wavre</span></h1>
			</div>
		</div>
		<nav>
			<?=$nav?>
		</nav>
	</header>
	<div id="main" class="main">
		<?php
			if ($search === false)
			{
			?>
				<section class="home-page">
					<div class="home-content">
						<img src="./assets/img/home.jpg" alt="bouton de recherche">
						<div class="home-text">
							<p class="maxWidth-container">Découvrez des saveurs, des goûts et des plaisirs gourmands chez le spécialiste des plats à emporter. Téléphonez et votre spécialité chinoise sera prête dans la demi-heure.</p>
						</div>
						<a class="home-nextPage" href="#infos"><img src="./assets/img/arrow.png" alt="passer à la page suivante"></a>
					</div>
				</section>
				<section id="infos" class="infos-page">
					<h2>Informations</h2>
					<?=$businessHours?>
					<?=$address?>
				</section>
				<section id="cartes" class="cartes-page">
					<?=$cartesHtml?>
				</section>
				<section id="menus" class="menus-page">
					<?=$menusHtml?>
				</section>
			<?php
			}
			else
			{
			?>
				<section id="search" class="searchResult-page">
					<?=$searchHtml?>
				</section>
			<?php
			}
		?>
	</div>
    <footer id="footer">
    	<div class="maxWidth-container footer-content">
    		<span class="downMenu-container">
    			<a href="./assets/pdf/hongkongexpress_wavre2017.pdf" target="_blank" rel="noopener">télécharger le menu</a>
    		</span>
    		<span class="contact-container">
				<p>010 24 36 09</p>
				<a href="https://www.facebook.com/hkexpresswavre" target="_blank" rel="noopener"><img class="facebook" src="./assets/img/facebook.png" alt="le logo facebook"></a>
			</span>
			<span class="backHome-container">
				<a href="#"><img src="./assets/img/arrow.png" alt="remonter en début de page"></a>
			</span>
		</div>
    </footer>
</body>
</html>