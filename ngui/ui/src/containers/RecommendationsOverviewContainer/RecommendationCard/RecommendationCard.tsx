import { Card, CardActions, CardContent, Link, Skeleton, Typography } from "@mui/material";
import useStyles from "./RecommendationCard.styles";

const RecommendationCard = ({ color, header, description, cta, onCtaClick, menu, children, isLoading = false }) => {
  const { classes } = useStyles(color);

  return (
    <Card elevation={0} className={classes.card}>
      <CardContent className={classes.content}>
        {isLoading ? <Skeleton width="100%" height={40} variant="text" /> : header}
        {description && (
          <Typography component="div" className={classes.description}>
            {isLoading ? <Skeleton width="100%" height={90} variant="text" /> : description}
          </Typography>
        )}
        {isLoading ? <Skeleton width="100%" height={70} variant="rectangular" /> : children}
      </CardContent>
      {(!!cta || !!menu) && (
        <CardActions className={classes.actions}>
          {isLoading ? (
            <Skeleton width="100%" height={40} />
          ) : (
            <>
              <Link component="button" variant="body2" onClick={onCtaClick}>
                {cta}
              </Link>
              {menu}
            </>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default RecommendationCard;
