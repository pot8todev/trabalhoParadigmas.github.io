<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= $pageTitle ?? 'default';  ?></title>
    <!-- Default style -->
    <link rel="stylesheet" href="assets/css/default.css"> 

    <!-- CSS manually given -->
    <?php if (isset($pageStyle)): ?>
        <link rel="stylesheet" href="assets/css/<?=htmlspecialchars($pageStyle)?>"> 
    <?php endif;?>


    

</head>
<body>
