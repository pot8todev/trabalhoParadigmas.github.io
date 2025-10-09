
<?php
$pageTitle = 'index';
$pageStyle = 'style-index.css';
$pageScript = 'script-index.js'; ?>


<?php include('includes/header.php'); ?>

<div class = "wrapper">

    <!-- <div id= "register"> -->
    <!-- </div> -->
        <main class = "register-container">
            <div class = "register">
            </div>
        </main>
teste2
teste1


    <!-- JS  manually given -->
    <?php if (!empty($pageScript)): ?>
        <script src = "assets/js/<?=htmlspecialchars($pageScript)?>" ></script>
    <?php endif;?>
</div>
<?php include 'includes/footer.php'; ?>



